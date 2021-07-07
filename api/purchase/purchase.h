#ifndef PURCHASE_H
#define PURCHASE_H

#include <boost/date_time/gregorian/gregorian.hpp>
#include <odb/core.hxx>
#include <odb/tr1/memory.hxx>
#include <string>

using boost::gregorian::date;
using std::tr1::shared_ptr;

#pragma db object
class purchase {
public:
  purchase(const std::string &username, const std::string &location,
           const std::string &category, float amount, const std::string &notes,
           const date &date)
      : username_(username), location_(location), category_(category),
        amount_(amount), notes_(notes), date_(date) {}

  const std::string &get_username() const { return username_; }
  void set_username(const std::string &username) { username_ = username; }

  const std::string &get_location() const { return location_; }
  void set_location(const std::string &location) { location_ = location; }

  const std::string &get_category() const { return category_; }
  void set_category(const std::string &category) { category_ = category; }

  const std::string &get_notes() const { return notes_; }
  void set_notes(const std::string &notes) { notes_ = notes; }

  float get_amount() { return amount_; }
  void set_amount(float amount) { amount_ = amount; }

  const date &get_date() { return date_; }
  void set_date(const date &date) { date_ = date; }

private:
  friend class odb::access;
  purchase() {}

#pragma db id auto
  unsigned long id_;

  std::string username_;
  std::string location_;
  std::string category_;
  std::string notes_;
  float amount_;
  date date_;
};

#pragma db view object(purchase) query((?) + "GROUP BY" + purchase::category_)
struct purchase_stat {
#pragma db column(purchase::category_)
  std::string category;

#pragma db column("sum(" + purchase::amount_ + ")")
  float total_amount;
};

#endif // PURCHASE_H
